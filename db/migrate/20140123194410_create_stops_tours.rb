class CreateStopsTours < ActiveRecord::Migration
  def up
    create_table :stop_tours do |t|
      t.references :stop
      t.references :tour

      t.integer :position

      t.timestamps
    end
  end

  def down
    drop_table :stop_tours
  end
end
