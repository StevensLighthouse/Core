class RemovePermissionTable < ActiveRecord::Migration
  def up
    drop_table :permissions
  end

  def down
  end
end
