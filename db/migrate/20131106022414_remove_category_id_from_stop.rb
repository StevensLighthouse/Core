class RemoveCategoryIdFromStop < ActiveRecord::Migration
  def up
    remove_column :stops, :category_id
  end

  def down
    add_column :stops, :catergory_id, :integer
  end
end
