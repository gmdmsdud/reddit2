import BaseEntity from './Entity'
import { IsEmail, Length } from "class-validator";
import { BeforeInsert, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from "bcryptjs";
import Post from "./Post";
import Vote from "./Vote";
@Entity("users")
export class User extends BaseEntity {
    @Index() //데이터베이스 인덱스를 생성합니다. 엔티티 속성 또는 엔티티에 사용할 수 있습니다. 엔티티에 사용될때 복합 열로 인덱스를 생성할 수 있습니다.
    @IsEmail(undefined, {message:"이메일주소가 잘못되었습니다."})
    @Length(1,255,{message:"이메일 주소는 비워둘수 없습니다."})
    @Column({ unique:true})
    email: string;

    @Index()
    @Length(3, 32, {message: "사용자 이름은 3자 이상이어야 합니다."})
    @Column({unique:true})
    username: string

    @Column()
    @Length(6,255, {message: '비밀번호는 6자리이상이어야 합니다.'})
    password: string;
 
    @OneToMany(() => Post,(post) =>post.user)
    posts:Post[]

    @OneToMany(() => Vote,(vote) => vote.user)
    votes: Vote[]

    @BeforeInsert() //비밀번호를 넣기전에 해쉬로 해서 저장
    async hashPassword() {
        this.password =await bcrypt.hash(this.password, 6)
    }
}