import { Link } from '../router';
export function PostReferences({corrects,correctedBy}:{corrects?:string|null;correctedBy?:string[]}){return <section className="post-references"><h2>References</h2>{corrects&&<p>Corrects <Link href={`/posts/${corrects}`}>{corrects}</Link></p>}{correctedBy?.map((id)=><p key={id}>Corrected by <Link href={`/posts/${id}`}>{id}</Link></p>)}</section>;}
