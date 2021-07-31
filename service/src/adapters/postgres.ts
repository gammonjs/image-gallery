import { Service } from 'typedi';
import {
    Connection,
    createConnection,
    EntityTarget,
    Repository
} from 'typeorm';


@Service()
class PostgresClient {
    private _connection: Connection;

    connect = async (): Promise<boolean> => {
        try {
            this._connection = await createConnection();

            if (!this._connection.isConnected) {
                console.log('Unable to make database connection');
                return true;
            }
            console.log('Connected to database');
            return true;
        } catch (e: any) {
            console.log(e);
            return false;
        }
    };

    connection = (): Connection => this._connection;

    getRepository<Entity>(target: EntityTarget<Entity>): Repository<Entity> {
        return this._connection.getRepository(target);
    }
}

export default PostgresClient;
