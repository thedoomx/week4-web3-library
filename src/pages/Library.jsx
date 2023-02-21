import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useSigner, useProvider } from 'wagmi';
import libraryABI from '../abi/Library.json';
import Button from '../components/ui/Button';

const Library = () => {
    const { data: signer } = useSigner();
    const contractAddress = '0xE663074c9ca6B331526E592196Bd6f2d192FA827'; // library goerli

    const initialAddBookFormData = {
        name: '',
        author: '',
        copies: 0
    };

    const provider = useProvider();
    // Contract states
    const [contract, setContract] = useState();
    const [isLoadingContractData, setIsLoadingContractData] = useState(true);

    // Form states
    const [addBookFromData, setAddBookFormData] = useState(initialAddBookFormData);
    const [borrowBookId, setBorrowBookId] = useState(0);
    const [returnBookId, setReturnBookId] = useState(0);
    const [availableBooks, setAvailableBooksFormData] = useState(0);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [formSubmitError, setFormSubmitError] = useState('');

    // Handlers
    const handleFormInputChange = e => {
        const { value, name } = e.target;

        setAddBookFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGetAvailableBooksButtonClick = async () => {
        setIsLoadingSubmit(true);
        setFormSubmitError('');
        try {
            console.log(contract);

            const tx = await contract.getAvailableBooks();
            console.log(tx);
            setAvailableBooksFormData(tx.length);
        } catch (e) {
            console.log(e);
            setFormSubmitError(e.reason);
        } finally {
            setIsLoadingSubmit(false);
        }
    }

    const handleAddBookButtonClick = async () => {
        setIsLoadingSubmit(true);
        setFormSubmitError('');
        try {
            const tx = await contract.addBook(addBookFromData.name, addBookFromData.author, addBookFromData.copies);

            const transactionAddBookReceipt = await tx.wait();
            if (transactionAddBookReceipt.status != 1) {
                console.log("Transaction for add book was not successful");
            }
        } catch (e) {
            console.log(e);
            setFormSubmitError(e.reason);
        } finally {
            setIsLoadingSubmit(false);
        }
    }

    const handleBorrowBookButtonClick = async () => {
        setIsLoadingSubmit(true);
        setFormSubmitError('');
        try {
            const tx = await contract.borrowBook(borrowBookId);

            const transactionBorrowBookReceipt = await tx.wait();
            console.log(transactionBorrowBookReceipt);
            if (transactionBorrowBookReceipt.status != 1) {
                console.log("Transaction for add book was not successful");
            }

        } catch (e) {
            console.log(e);
            setFormSubmitError(e.reason);
        } finally {
            setIsLoadingSubmit(false);
        }
    }

    const handleReturnBookButtonClick = async () => {
        setIsLoadingSubmit(true);
        setFormSubmitError('');
        try {
            const tx = await contract.returnBook(returnBookId);
            const transactionReturnBookReceipt = await tx.wait();
            if (transactionReturnBookReceipt != 1) {
                console.log("Transaction for return book was not successful");
            }
        } catch (e) {
            setFormSubmitError(e.reason);
        } finally {
            setIsLoadingSubmit(false);
        }
    }

    const getContractData = useCallback(async () => {
        setIsLoadingContractData(true);

        setIsLoadingContractData(false);
    }, [contract]);

    // Use effects
    useEffect(() => {
        if (signer) {
            const libraryContract = new ethers.Contract(contractAddress, libraryABI, signer);

            setContract(libraryContract);
        }
    }, [signer]);

    useEffect(() => {
        contract && getContractData();
    }, [contract, getContractData]);

    return (
        <div className="container my-5 my-lg-10">
            <div className="row">
                <div className="col-6 offset-3">
                    <h2 className="heading-medium text-center mb-5">Library</h2>
                    {isLoadingContractData ? (
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-info" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-center ms-3">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {' '}
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="text-center">
                                            <p className="text-bold">
                                                Current available books : {availableBooks}
                                            </p>
                                            <div className="mt-4 d-flex justify-content-center">
                                                <Button
                                                    className="ms-2"
                                                    onClick={handleGetAvailableBooksButtonClick}
                                                    loading={isLoadingSubmit}
                                                    type="secondary">
                                                    Get Available Books
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="text-center">
                                            <p className="text-bold">
                                                Add book
                                            </p>

                                            <div>
                                                <p className="text-small text-bold">Name:</p>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={addBookFromData.name}
                                                    onChange={handleFormInputChange}
                                                />
                                            </div>

                                            <div>
                                                <p className="text-small text-bold">Author:</p>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="author"
                                                    value={addBookFromData.author}
                                                    onChange={handleFormInputChange}
                                                />
                                            </div>

                                            <div>
                                                <p className="text-small text-bold">Copies:</p>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="copies"
                                                    value={addBookFromData.copies}
                                                    onChange={handleFormInputChange}
                                                />
                                            </div>
                                            <div className="mt-4 d-flex justify-content-center">
                                                <Button
                                                    className="ms-2"
                                                    onClick={handleAddBookButtonClick}
                                                    loading={isLoadingSubmit}
                                                    type="secondary">
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="text-center">
                                            <p className="text-bold">
                                                Borrow book
                                            </p>
                                            <div>
                                                <p className="text-small text-bold">Id:</p>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="copies"
                                                    value={borrowBookId}
                                                    onChange={(event) => setBorrowBookId(event.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4 d-flex justify-content-center">
                                                <Button
                                                    className="ms-2"
                                                    onClick={handleBorrowBookButtonClick}
                                                    loading={isLoadingSubmit}
                                                    type="secondary">
                                                    Borrow
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="text-center">
                                            <p className="text-bold">
                                                Return book
                                            </p>
                                            <div>
                                                <p className="text-small text-bold">Id:</p>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={returnBookId}
                                                    onChange={(event) => setReturnBookId(event.target.value)}
                                                />
                                            </div>
                                            <div className="mt-4 d-flex justify-content-center">
                                                <Button
                                                    className="ms-2"
                                                    onClick={handleReturnBookButtonClick}
                                                    loading={isLoadingSubmit}
                                                    type="secondary">
                                                    Return
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Library;
