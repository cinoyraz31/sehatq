class AddHospitalUser < ActiveRecord::Migration[5.1]
  def change
  	create_table :hospital_users, id: :integer do |t|
  		t.integer :hospital_id
  		t.integer :user_id
  		t.string :status
  		t.timestamps null: false
  	end
  end
end
