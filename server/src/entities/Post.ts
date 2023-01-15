import {Exclude,Expose} from 'class-transformer';

import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { makeId ,slugify} from "../utils/helpers";
import Comment from './Comment';
import BaseEntity from './Entity' 
import Sub from "./Sub";
import { User } from "./User";
import Vote from './Vote';

@Entity("posts")
export default class Post extends BaseEntity {
    @Index()
    @Column()
    identifier: string;

    @Column()
    title: string;

    @Index()
    @Column()
    slug:string;

    @Column({nullable:true, type: "text"})
    body: string;

    @Column()
    subName:string;

    @Column()
    username: string;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: "username", referencedColumnName: "username"})
    user: User;

    @ManyToOne(() => Sub, (sub) => sub.posts)
    @JoinColumn({name: "subName", referencedColumnName: "name"})
    sub: Sub;

    @Exclude() //comments 라는 프로퍼티를스킵
    @OneToMany(() => Comment, (comment) =>comment.post)
    comments:Comment[];

    @Exclude()
    @OneToMany(()=> Vote, (vote) =>vote.post) 
    votes: Vote[];
    

    @Expose() get url():string {
        return `/r/${this.subName}/${this.identifier}/${this.slug}`
    }

    @Expose() get commentCount(): number{
        return this.comments?.length;
    }

    @Expose() get voteScore(): number {
        return this.votes?.reduce((memo,curt) =>memo + (curt.value || 0),0);

    }

    protected userVote: number;

    setUserVote(user: User) {
        const index =this.votes?.findIndex(v =>v.username === user.username);
        this.userVote= index > -1 ? this.votes[index].value : 0;

    }

    @BeforeInsert()//저장하기전에 먼가 해준다
    makeIdAndSlug() {//utils>helpers.ts에 함수를만들어 저장해준다
        this.identifier = makeId(7);//자동으로 7자리 아이디를 만들어준다
        this.slug = slugify(this.title);
    }
}