class DropStopsTours < ActiveRecord::Migration
  def up
    drop_table :stops_tours
  end

  def down
  end
end
