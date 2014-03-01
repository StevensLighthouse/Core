class CreateStopPhoto < ActiveRecord::Migration
  def up
    create_table :stop_photos do |t|
      t.string :photo
      t.references :stop
      t.text :description

      t.timestamps
    end
  end

  def down
    drop_table :stop_photos
  end
end
