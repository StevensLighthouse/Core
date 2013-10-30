class CreateUserTable < ActiveRecord::Migration
  def up
    create_table :users do |t|
      t.string :email
      t.string :hashed_password
      t.string :password_salt
      t.datetime :last_login
      t.references :creator
      t.references :editor

      t.timestamps
    end
  end

  def down
    drop_table :users
  end
end
