class AddTourDeletion < ActiveRecord::Migration
  def up
    add_column :tours, :deleted, :boolean, :default => true
  end

  def down
    remove_column :tours, :deleted
  end
end
