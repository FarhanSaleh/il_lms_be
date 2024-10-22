const Permissions = require("../models/permissions");
const Module = require("../models/module_permission");
const { err } = require("../utils/customError");
const Roles = require("../models/roles");
const { uuid } = require("../utils/tools");

async function createPermission(req, res) {
  const { roleId, listModules } = req.body;
  try {
    const allModule = await Module.getAllModule();

    for (let i = 0; i < allModule.length; i++) {
      const module = allModule[i];
      let permissionData = {
        can_create: 0,
        can_read: 0,
        can_edit: 0,
        can_delete: 0,
        roleId: roleId,
        moduleId: module.id,
      };
      for (let j = 0; j < listModules.length; j++) {
        if (listModules[j].moduleId === module.id.toString()) {
          permissionData.can_create = listModules[j].canCreate ? 1 : 0;
          permissionData.can_read = listModules[j].canRead ? 1 : 0;
          permissionData.can_edit = listModules[j].canUpdate ? 1 : 0;
          permissionData.can_delete = listModules[j].canDelete ? 1 : 0;
          break;
        }
      }
      await Permissions.createPermission(permissionData);
    }
    res.status(200).json({ message: "Permissions created successfully" });
  } catch (error) {
    res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}
async function updatePermission(req, res) {
  const { id: roleId } = req.params;
  const { listModules } = req.body;
  let newValue = [];

  try {
    const isRoleExists = await Roles.getRoleById(roleId);
    if (isRoleExists === undefined) {
      return res.status(400).json({ message: "Role not found" });
    }

    const moduleLength = listModules.length;
    for (let i = 0; i < moduleLength; i++) {
      const { moduleId, canRead, canCreate, canUpdate, canDelete } =
        listModules[i];

      const isExists = await Permissions.getPermissionByRoleAndModule(
        roleId,
        moduleId
      );

      if (isExists !== undefined) {
        // update query for existing role and module
        const updateData = {
          canRead,
          canCreate,
          canUpdate,
          canDelete,
        };
        await Permissions.updatePermission(roleId, moduleId, updateData);
      }

      if (isExists === undefined) {
        // insert new permission role and module if not exists
        newValue.push([
          uuid(),
          canCreate,
          canRead,
          canUpdate,
          canDelete,
          roleId,
          moduleId,
        ]);
      }
    }

    if (newValue.length > 0) {
      // in here we do inserting bulk query
      await Permissions.createBulkPermission(
        `INSERT INTO role_permissions ( 
          id, can_create, can_read, can_edit, can_delete, role_id,  module_id
        ) VALUES ?`,
        [newValue]
      );
    }

    return res.status(200).json({
      message: "Permissions updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}
async function getAllPermission(req, res) {
  try {
    const result = await Permissions.getAllPermission();

    if (!result || result.length === 0) {
      throw new Error("No permissions found");
    }
    const permissionList = [];

    for (let i = 0; i < result.length; i++) {
      const permission = result[i];
      const listObj = new Object();
      listObj.id = permission.id;
      listObj.can_create = permission.can_create;
      listObj.can_read = permission.can_read;
      listObj.can_edit = permission.can_edit;
      listObj.can_delete = permission.can_delete;
      listObj.role_id = permission.role;
      listObj.module_permission_id = permission.module;
      permissionList.push(listObj);
    }
    return res.status(200).json({
      result: permissionList,
    });
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function getPermissionByRole(req, res) {
  const roleId = req.params.id;
  try {
    const result = await Permissions.getPermissionByRole(roleId);
    if (result === undefined) {
      throw new Error("No permissions found");
    }
    return res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function getPermissions(user) {
  try {
    const permissions = await Permissions.getPermissionByRole(user.role_id);
    if (permissions === undefined) {
      throw new Error("Permissions not found for this role");
    }
    console.log(permissions);
    return permissions;
  } catch (error) {
    res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
module.exports = {
  createPermission,
  updatePermission,
  getAllPermission,
  getPermissionByRole,
  getPermissions,
};
