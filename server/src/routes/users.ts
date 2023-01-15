import { Request, Response, Router } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import { User } from "../entities/User";
import userMiddleware from "../middlewares/user"

const getUserData = async(req:Request, res:Response) => {
    try {
        //유저정보 가져오기
        const user = await User.findOneOrFail({
            where: {username: req.params.username},
            select: ["username","createdAt"]
        })

        //유저가 쓴 포스트 정보가져오기
        const posts = await Post.find({
            where:{username: user.username},
            relations:["comments","votes","sub"]
        })
        //유저가쓴 댓글정보 가져오기
        const comments =await Comment.find({
            where: {username: user.username},
            relations: ["post"],
        })

        if(res.locals.user){
            const {user} =res.locals;
            posts.forEach(p => p.setUserVote(user));
            comments.forEach(c => c.setUserVote(user));
        }
        let userData: any[] =[]; //userData 만들기

        posts.forEach(p => userData.push({type:"Post", ...p.toJSON()})) //post 유저데이터에 post정보와 커멘트정보 푸쉬  클레스로 되있으면안되서 json형식으로 보내야된다
        comments.forEach(c => userData.push({type:"comment",...c.toJSON()}))

        userData.sort((a,b) => {
            if(b.createdAt > a.cratedAt) return 1;
            if(b.createdAt < a.cratedAt) return -1;
            return 0;

            
        })
        return res.json ({user,userData})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "문제가 발생했습니다"})

        
    }
}
const router =Router();//익스프레스에서 가져오고
router.get("/:username", userMiddleware,getUserData);//핸들러를 만들어주고

export default router;