import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    generatedId: string;

    @Column({
        type: 'bytea'
    })
    data: Buffer;

    @Column()
    name: string;

    @Column()
    mimeType: string;
}
