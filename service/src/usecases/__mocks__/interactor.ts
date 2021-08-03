import { Request, Response } from "express";
import UsecaseInteractor, { UsecaseHandler } from "../interactor";

type Handler = (req: Request, res: Response) => Promise<void>;

jest.mock('../../usecases/interactor');

class MockUsecaseInteractor extends UsecaseInteractor {
    public readonly MockCreateOne = (
        req: Request,
        res: Response
    ): Promise<void> => new Promise((resolve, reject) => resolve());

    public readonly MockGetMany = (
        req: Request,
        res: Response
    ): Promise<void> => new Promise((resolve, reject) => resolve());

    public readonly MockGetOne = (
        req: Request,
        res: Response
    ): Promise<void> => new Promise((resolve, reject) => resolve());

    connect = jest.fn();

    createOne = jest.fn(
        (usecase: UsecaseHandler): Handler => this.MockCreateOne
    );

    getMany = jest.fn(
        (usecase: UsecaseHandler): Handler => this.MockGetMany
    );

    getOne = jest.fn(
        (usecase: UsecaseHandler): Handler => this.MockGetOne
    );
}

export default MockUsecaseInteractor;
