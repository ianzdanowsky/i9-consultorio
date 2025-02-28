import PesquisaClient from "./client";
import { auth } from "~/server/auth/index";

export default  async function PesquisaPage(){
    const session = await auth()
    return (
        <PesquisaClient session={session}/>
    )
}