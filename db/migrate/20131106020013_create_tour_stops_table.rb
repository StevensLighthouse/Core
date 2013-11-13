class CreateTourStopsTable < ActiveRecord::Migration
  def up
    create_table :stops_tours, :id => false do |t|
      t.references :tour
      t.references :stop

      t.timestamps
    end

  end

  def down
    drop_table :stops_tours
  end
end
