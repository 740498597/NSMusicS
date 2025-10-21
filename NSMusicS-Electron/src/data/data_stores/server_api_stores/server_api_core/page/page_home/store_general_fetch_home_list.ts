import { reactive } from 'vue'
// @ts-ignore - 忽略模块导入类型检查
import { usePageHomeStore } from '@/data/data_status/app_status/page_status/home_store/usePageHomeStore'
// @ts-ignore - 忽略模块导入类型检查
import { Get_LocalSqlite_HomeDataInfos } from '@/data/data_repository/app_repository/LocalSqlite_Get_HomeDataInfos'
// @ts-ignore - 忽略模块导入类型检查
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
// @ts-ignore - 忽略模块导入类型检查
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/data/data_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
// @ts-ignore - 忽略模块导入类型检查
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
// @ts-ignore - 忽略模块导入类型检查
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/data/data_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite'
// @ts-ignore - 忽略模块导入类型检查
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
// @ts-ignore - 忽略模块导入类型检查
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export const store_general_fetch_home_list = reactive({
  async fetchData_Home() {
    try {
      // @ts-ignore - 忽略store实例类型检查
      const pageHomeStore = usePageHomeStore()
      pageHomeStore.home_Files_temporary_maximum_playback = []
      pageHomeStore.home_Files_temporary_random_search = []
      pageHomeStore.home_Files_temporary_recently_added = []
      pageHomeStore.home_Files_temporary_recently_played = []
      pageHomeStore.home_selected_top_album = undefined

      // @ts-ignore - 忽略属性访问类型检查
      if (store_server_user_model.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_LocalSqlite_HomeDataInfos()
        pageHomeStore.home_Files_temporary_maximum_playback =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Maximum_Playback()
        pageHomeStore.home_Files_temporary_random_search =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Random_Search()
        pageHomeStore.home_Files_temporary_recently_added =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Added()
        pageHomeStore.home_Files_temporary_recently_played =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Played()
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list(
            store_server_login_info.server_url
          )
        } else if (store_server_users.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt
          )
        } else if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list(
            store_server_user_model.parentid_of_Je_Music
          )
        }
      }

      pageHomeStore.home_selected_top_album =
        pageHomeStore.home_Files_temporary_random_search.length > 0
          ? pageHomeStore.home_Files_temporary_random_search[0]
          : undefined
    } catch (error) {
      console.error('Failed to fetch home data:', error)
    }
  },

  async fetchData_Home_of_maximum_playback() {
    try {
      const pageHomeStore = usePageHomeStore()
      pageHomeStore.home_Files_temporary_maximum_playback = []
      if (store_server_user_model.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_LocalSqlite_HomeDataInfos()
        pageHomeStore.home_Files_temporary_maximum_playback =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Maximum_Playback()
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_NineSong_Temp_Data_To_LocalSqlite.get_home_list_of_maximum_playback(
            store_server_login_info.server_url,
            false
          )
        } else if (store_server_users.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_maximum_playback(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt
          )
        } else if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_maximum_playback(
            store_server_user_model.parentid_of_Je_Music
          )
        }
      }
    } catch (error) {
      // @ts-ignore - 忽略错误类型检查
      console.error('Failed to fetch maximum playback data:', error)
    }
  },

  async fetchData_Home_of_random_search() {
    try {
      const pageHomeStore = usePageHomeStore()
      pageHomeStore.home_selected_top_album_subscript = 0
      pageHomeStore.home_Files_temporary_random_search = []
      pageHomeStore.home_selected_top_album = undefined
      if (store_server_user_model.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_LocalSqlite_HomeDataInfos()
        pageHomeStore.home_Files_temporary_random_search =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Random_Search()
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_random_search(
            store_server_login_info.server_url
          )
        } else if (store_server_users.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_random_search(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt
          )
        } else if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_random_search(
            store_server_user_model.parentid_of_Je_Music
          )
        }
      }
      // @ts-ignore - 忽略属性访问类型检查
      pageHomeStore.home_selected_top_album =
        pageHomeStore.home_Files_temporary_random_search.length > 0
          ? pageHomeStore.home_Files_temporary_random_search[0]
          : undefined
    } catch (error) {
      // @ts-ignore - 忽略错误类型检查
      console.error('Failed to fetch random search data:', error)
    }
  },

  async fetchData_Home_of_recently_added() {
    try {
      // @ts-ignore - 忽略store实例类型检查
      const pageHomeStore = usePageHomeStore()
      pageHomeStore.home_Files_temporary_recently_added = []
      // @ts-ignore - 忽略属性访问类型检查
      if (store_server_user_model.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_LocalSqlite_HomeDataInfos()
        pageHomeStore.home_Files_temporary_recently_added =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Added()
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_added(
            store_server_login_info.server_url
          )
        } else if (store_server_users.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_added(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt
          )
        } else if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_recently_added(
            store_server_user_model.parentid_of_Je_Music
          )
        }
      }
    } catch (error) {
      // @ts-ignore - 忽略错误类型检查
      console.error('Failed to fetch recently added data:', error)
    }
  },

  async fetchData_Home_of_recently_played() {
    try {
      // @ts-ignore - 忽略store实例类型检查
      const pageHomeStore = usePageHomeStore()
      pageHomeStore.home_Files_temporary_recently_played = []
      // @ts-ignore - 忽略属性访问类型检查
      if (store_server_user_model.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_LocalSqlite_HomeDataInfos()
        pageHomeStore.home_Files_temporary_recently_played =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Played()
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_played(
            store_server_login_info.server_url
          )
        } else if (store_server_users.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_played(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt
          )
        } else if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_recently_played(
            store_server_user_model.parentid_of_Je_Music
          )
        }
      }
    } catch (error) {
      // @ts-ignore - 忽略错误类型检查
      console.error('Failed to fetch recently played data:', error)
    }
  },
})
