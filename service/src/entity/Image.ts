import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn
} from 'typeorm';

interface IImage {
    generatedId: string;
    name: string;
    mimeType: string;

}

@Entity()
export class Image implements IImage {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    generatedId: string;

    @Column()
    name: string;

    @Column()
    mimeType: string;
}
