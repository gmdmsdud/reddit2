// import { Request, Response } from "express";

// // controller
// const getBoards = async (req: Request<{}, {}, {}, { keyword: string }>, res: Response) => {
//     try {
//     const { keyword } = req.query;
//     const searchResult = await boardService.getBoards(keyword);
//     return res.status(200).json(searchResult);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({error: "문제가 발생했습니다"})
//     }
// }


// const searchs =async (req: Request, res: Response) =>{
//     try {
//         const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' ||s."imageUrn", 'https://www.gravatar.com/avatar?d=mp&f=y')`;
//         const subs = await AppDataSource.createQueryBuilder()
//         .select()
//         .from(Post)
//         .where('title ILIKE :searchTerm', {searchTerm: `%${searchTerm}%`})
//         .orWhere('body ILIKE :searchTerm', {searchTerm: `%${searchTerm}%`})
//         .getMany();
//     return res.json(search);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "문제가 발생했습니다." });
//   }
// };