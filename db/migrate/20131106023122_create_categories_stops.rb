class CreateCategoriesStops < ActiveRecord::Migration
  def up
    create_table :categories_stops do |t|
      t.references :category
      t.references :stop

      t.timestamps
    end
  end

  def down
    drop_table :categories_stops
  end
end
