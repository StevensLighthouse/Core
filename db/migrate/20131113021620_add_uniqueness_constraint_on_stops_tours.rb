class AddUniquenessConstraintOnStopsTours < ActiveRecord::Migration
  def up
    add_column :stops_tours, :position, :integer
    add_index :stops_tours, [:stop_id, :tour_id, :position], :unique => true
  end

  def down
    delete_column :stops_tours, :position
    remove_index :stops_tours, [:stop_id, :tour_id, :position]
  end
end
