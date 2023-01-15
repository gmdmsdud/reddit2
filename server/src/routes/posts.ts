import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user"
import authMiddleware from "../middlewares/auth"
import Sub from "../entities/Sub";
import Post from "../entities/Post";
import Comment from "../entities/Comment";


const getPosts =async (req: Request, res: Response) =>{
    const currentPage: number = (req.query.page || 0) as number //페이지가있으면 사용하고 없으면 0으로
    const perPage: number = (req.query.count || 3) as number //카운트가 있으면 카운트를 사용하고 없으면 8개

    try {
        const posts = await Post.find({
            order:{createdAt: "DESC"},
            relations: ["sub","votes", "comments"],
            skip: currentPage * perPage,
            take: perPage
        })
        if(res.locals.user) {
            posts.forEach(p =>p.setUserVote(res.locals.user));

        }
        return res.json(posts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "문제가 발생했습니다"})
    }
}

    const getPost =async (req: Request, res: Response) =>{
    const {identifier,slug} =req.params;
    try {
        const post = await Post.findOneOrFail({
            where: {identifier, slug},
            relations: ["sub", "votes"]
        })

        if(res.locals.user) {
            post.setUserVote(res.locals.user);
        }

        return res.send(post);
    } catch (error) {
        console.log(error);
        return res.status(404).json({error: "게시물을 찾을수 없습니다."})
    }
}

const getPostComments = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;
    try {
        const post = await Post.findOneByOrFail({ identifier, slug});
        const comments = await Comment.find({
            where: { postId: post.id},
            order: { createdAt: "DESC"},
            relations: ["votes"]
        })
        if(res.locals.user){
            comments.forEach((c) => c.setUserVote(res.locals.user));
        }
        return res.json(comments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"문제가 발생했습니다"})
    }
}
const createPost =async (req: Request, res: Response) =>{
    const {title,body, sub} =req.body;
    if(title.trim() === "") {
        return res.status(400).json({ title: "제목은 비워둘 수 없습니다."});
    }
    const user =res.locals.user;
    
    try {
        const subRecord = await Sub.findOneByOrFail({name:sub})
        const post =new Post();
        post.title = title;
        post.body = body;
        post.user = user;
        post.sub = subRecord;

        await post.save();

        return res.json(post);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
    }  
};

const createPostComment = async ( req: Request, res: Response) => {
    const {identifier, slug} = req.params;
    const body = req.body.body;
//[slug]에서 handleSubmit의 요청을 body라고 해서 body.body
    try {
        const post = await Post.findOneByOrFail({identifier, slug})
        //post를 데이터베이스에서 찾아온다
        const comment =new Comment();
        comment.body = body;
        comment.user = res.locals.user;
        //middlewares에서 받아온값
        comment.post = post;
        if (res.locals.user) {
            post.setUserVote(res.locals.user);
        }
        await comment.save();
        return res.json(comment);
        //저장을한 댓글을 보내준다

    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: "게시물을 찾을수 없습니다. "})
    }}

const router = Router();
router.get("/:identifier/:slug", userMiddleware, getPost);
router.post("/", userMiddleware, authMiddleware, createPost);

router.get("/", userMiddleware, getPosts)

router.get("/:identifier/:slug/comments", userMiddleware, getPostComments);
router.post("/:identifier/:slug/comments", userMiddleware, createPostComment);

export default router;
