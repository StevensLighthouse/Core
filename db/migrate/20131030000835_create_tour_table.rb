class CreateTourTable < ActiveRecord::Migration
  def up
    create_table :tours do |t|
      t.string :name
      t.references :editor
      t.references :creator
      t.boolean :visibility
      t.decimal :lat, :scale => 6, :precision => 9
      t.decimal :lon, :scale => 6, :precision => 9

      t.timestamps
    end
  end

  def down
    drop_table :tours
  end
end
