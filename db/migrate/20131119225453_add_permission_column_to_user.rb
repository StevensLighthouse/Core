class AddPermissionColumnToUser < ActiveRecord::Migration
  def up
    add_column :users, :permission, :integer
  end

  def down
    remove_column :users, :permission
  end
end
