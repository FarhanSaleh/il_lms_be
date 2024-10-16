const { query1, query2 } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Permissions = {
  createRolePermission: async (dataPermissions) => {
    try {
      const id = uuid();
      const result = await query1(
        `INSERT INTO role_permissions (id, can_create, can_read, can_edit, can_delete, role_id,  module_permission_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          dataPermissions.can_create ? 1 : 0,
          dataPermissions.can_read ? 1 : 0,
          dataPermissions.can_edit ? 1 : 0,
          dataPermissions.can_delete ? 1 : 0,
          dataPermissions.roleId,
          dataPermissions.modulePermissionId,
        ]
      );
      return result;
    } catch (error) {
      console.error("Error creating role permission: ", error);
      throw error;
    }
  },
  getPermissionsByRoleid: async (role_id) => {
    try {
      const result = await query1(
        `SELECT lms_db2.role_permissions.can_create AS 'create', 
              lms_db2.role_permissions.can_read AS 'read', 
              lms_db2.role_permissions.can_edit AS 'edit', 
              lms_db2.role_permissions.can_delete AS 'delete', 
              lms_module.module_permission.uuid AS permissionId,
              lms_module.module_permission.name AS moduleName,
              lms_module.category_module_permissions.name AS categoryName
          FROM lms_db2.role_permissions 
          LEFT JOIN lms_module.module_permission 
            ON lms_db2.role_permissions.module_permission_id = module_permission.id
            LEFT JOIN lms_module.category_module_permissions
            ON lms_module.module_permission.category_module_permissions_id = category_module_permissions.id
        WHERE role_id = ?`,
        [role_id]
      );
      return result; 
    } catch (error) {
      throw error;
    }
  },
};
module.exports = Permissions;