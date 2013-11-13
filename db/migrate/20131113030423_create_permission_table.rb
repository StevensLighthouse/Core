class CreatePermissionTable < ActiveRecord::Migration
  def up
    create_table :permissions do |t|
      t.string :name
      t.text :description
      t.integer :level
    end
  end

  def down
    drop_table :permissions
  end
end
