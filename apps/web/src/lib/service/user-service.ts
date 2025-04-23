import { CrepenDB } from "../common/db-conn";
import { CrepenUser } from "./types/user";

export class CrepenUserService {
    
    public static async getUserById(id?: string): Promise<CrepenUser | undefined> {

        let conn = undefined;
        let findUser : CrepenUser | undefined = undefined;
        try{
            const pool = CrepenDB.getPool();
            conn = await pool.getConnection();
            const result = await conn.query("SELECT * FROM user WHERE account_id = ?", [id]);
            const rows = result[0] as CrepenUser[];
          
            if(rows.length > 0){
                findUser = rows[0];
            }
        }
        catch(e){
            console.error(e);
        }
        finally{
            if (conn) conn.release(); //release to pool
        }

        return findUser;
    }
}