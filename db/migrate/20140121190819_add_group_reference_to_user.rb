class AddGroupReferenceToUser < ActiveRecord::Migration
  def up
    change_table :users do |t| 
      t.references :group
    end
  end

  def down
    remove_column :users, :group_id
  end
end
