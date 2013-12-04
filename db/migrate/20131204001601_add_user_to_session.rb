class AddUserToSession < ActiveRecord::Migration
  def up
    change_table :sessions do |t|
      t.references :user
    end
  end
  
  def down
    remove_column :sessions, :user_id
  end
end
