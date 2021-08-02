import { Service } from "typedi";
import { v4 as uuidv4 } from 'uuid';

@Service()
class UUID {
    Create = () => uuidv4();
}

export default UUID
