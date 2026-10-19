import { useEffect,useState } from 'react';
import { fetchPost,type PostResponse } from '../api/post';
import { MarkdownBody } from '../components/MarkdownBody';
import { Link } from '../router';
export function PostPage({id}:{id:string}){const [post,setPost]=useState<PostResponse|null>(null);const [error,setError]=useState(false);useEffect(()=>{fetchPost(id).then(setPost).catch(()=>setError(true))},[id]);if(error)return <section className="article-page"><h1>Publication not found</h1><Link href="/">Back to timeline</Link></section>;if(!post)return <p className="feed-loading">Loading publication…</p>;return <article className="article-page"><meta/><Link href="/">← Back to timeline</Link><h1>{id}</h1><MarkdownBody markdown={post.body_markdown}/><p className="article-permalink">/posts/{id}</p></article>;}
