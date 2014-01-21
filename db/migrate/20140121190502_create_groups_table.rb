class CreateGroupsTable < ActiveRecord::Migration
  def up
    create_table :groups do |t|
      t.string :name
      t.text :description
        
      t.timestamps
    end
  end

  def down
    drop_table :groups
  end
end
