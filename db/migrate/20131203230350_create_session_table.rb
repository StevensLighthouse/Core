class CreateSessionTable < ActiveRecord::Migration
  def up
    create_table :sessions do |t|
      t.string :user_agent
      t.datetime :expiry_time
      t.string :ip_address

      t.timestamps
    end
  end

  def down
    drop_table :sessions
  end
end
