class AddTourDeletion < ActiveRecord::Migration
  def up
    add_column :tours, :deleted, :boolean, :default => false
  end

  def down
    remove_column :tours, :deleted
  end
end
