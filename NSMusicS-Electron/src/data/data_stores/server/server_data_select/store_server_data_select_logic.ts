import {reactive} from 'vue'
import {
    store_server_navidrome_userdata_logic
} from "@/data/data_stores/server/server_data_select/server_navidrome_user_data/store_server_navidrome_userdata_logic";
import {Set_ServerInfo_To_LocalSqlite} from "../../../data_access/local_configs/class_Set_ServerInfo_To_LocalSqlite";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_server_jellyfin_userdata_logic} from "./server_jellyfin_user_data/store_server_jellyfin_userdata_logic";

export const store_server_data_select_logic = reactive({
    /// server add
    async update_server_addUser(
        server_set_of_addUser_of_servername: string,
        server_set_of_addUser_of_url: string,
        server_set_of_addUser_of_username: string,
        server_set_of_addUser_of_password: string,
        type: string
    ) {
        if(type === 'navidrome'){
            return store_server_navidrome_userdata_logic.navidrome_update_server_addUser(
                server_set_of_addUser_of_servername,
                server_set_of_addUser_of_url,
                server_set_of_addUser_of_username,
                server_set_of_addUser_of_password,
                type
            );
        }else if(type === 'jellyfin' || type === 'emby'){
            return store_server_jellyfin_userdata_logic.jellyfin_update_server_addUser(
                server_set_of_addUser_of_servername,
                server_set_of_addUser_of_url,
                server_set_of_addUser_of_username,
                server_set_of_addUser_of_password,
                type
            )
        }
        return false
    },

    /// server update
    async update_server_setUser(
        id:string, server_name:string, url:string,
        user_name:string, password:string,
        type: string
    ) {
        if(type === 'navidrome') {
            return store_server_navidrome_userdata_logic.navidrome_update_server_setUser(
                id,
                server_name, url,
                user_name, password,
                type
            );
        }else if(type === 'jellyfin' || type === 'emby'){
            return store_server_jellyfin_userdata_logic.jellyfin_update_server_setUser(
                id,
                server_name, url,
                user_name, password,
                type
            )
        }
        return false
    },

    /// server login and get token
    async update_server_config_of_current_user_of_sqlite(
        value: any,
        type: string
    ){
        if(type === 'navidrome') {
            return store_server_navidrome_userdata_logic.navidrome_update_server_config_of_current_user_of_sqlite(
                value
            );
        }else if(type === 'jellyfin' || type === 'emby'){
            return store_server_jellyfin_userdata_logic.jellyfin_update_server_config_of_current_user_of_sqlite(
                value
            )
        }
        return false
    },

    /// server delete
    async update_server_deleteUser(
        id: string
    ) {
        try {
            let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite();
            set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_DeleteUser(id);
            const new_data: Server_Configs_Props[] = store_server_users.server_config_of_all_user_of_sqlite;
            const index = new_data.findIndex(item => item.id === id);
            new_data.splice(index, 1);
            store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
            return true;
        }catch {}
        return false;
    },
});