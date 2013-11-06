class CreateCategories < ActiveRecord::Migration
  def up
    create_table :categories do |t|
      t.string :name
      t.text :description
      t.text :icon_base64

      t.timestamps
    end
  end

  def down
    drop_table :categories
  end
end
