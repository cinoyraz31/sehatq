class AddUser < ActiveRecord::Migration[5.1]
  def change
  	create_table :users, id: :integer do |t|
  		t.string :email,              null: false, default: ""
	    t.string :encrypted_password, null: false, default: ""	

	    t.string :first_name
	    t.string :last_name
	    t.string :full_name
	    t.string :gender
	    t.date :date_birth
	    t.string :place_birth
	    t.string :status
	    t.string :position
	    t.datetime :registered_at
	    t.timestamps null: false
  	end
  	add_index :users, :email,                unique: true
  end
end
