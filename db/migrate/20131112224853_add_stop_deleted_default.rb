class AddStopDeletedDefault < ActiveRecord::Migration
  def up
    remove_column :stops, :deleted
    add_column :stops, :deleted, :boolean, :default => true
  end

  def down
    remove_column :stops, :deleted
    add_column :stops, :deleted, :boolean
  end
end
