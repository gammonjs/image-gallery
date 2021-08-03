import ResponseFactory from "../../factories/response";

jest.mock('../../factories/response');

class MockResponseFactory extends ResponseFactory {
    Create = jest.fn();
}

export default MockResponseFactory;
