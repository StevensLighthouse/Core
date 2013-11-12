class CreateStopTable < ActiveRecord::Migration
  def up
    create_table :stops do |t|
      t.string :name
      t.text :description
      t.integer :category_id
      t.references :editor
      t.references :creator
      t.boolean :visibility
      t.decimal :lat, :scale => 6, :precision => 9
      t.decimal :lon, :scale => 6, :precision =>9
      t.integer :parent_id
      t.boolean :deleted

      t.timestamps
    end
  end

  def down
    drop_table :stops
  end
end
