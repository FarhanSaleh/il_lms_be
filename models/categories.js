const { query1 } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const { deleteCourse } = require("./course");

const Categories = {
  createCategories: async (categoriesData) => {
    try {
      const id = uuid();
      const result = await query1(
        `INSERT INTO categories(id, name) 
        VALUES(?,?)`,
        [id, categoriesData.name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateCategories: async (categoriesId, categoriesData) => {
    try {
      const result = await query1(
        `UPDATE categories
          SET
          name = ?,
          updated_at = NOW()
          WHERE id =?`,
        [categoriesData.name, categoriesId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteCourse: async (categoriesId) => {
    try {
      const result = await query1(`DELETE FROM categories WHERE id = ?`, categoriesId);
      return result;
    } catch (error) {
      throw error;
    }
  }
};
module.exports = Categories;
