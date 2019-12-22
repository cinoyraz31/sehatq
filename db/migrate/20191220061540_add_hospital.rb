class AddHospital < ActiveRecord::Migration[5.1]
  def change
  	create_table :hospitals, id: :integer do |t|
  		t.string :name
  		t.string :phone
  		t.text :address
  		t.timestamps null: false
  	end
  end
end
