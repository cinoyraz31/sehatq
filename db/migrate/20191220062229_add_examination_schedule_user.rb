class AddExaminationScheduleUser < ActiveRecord::Migration[5.1]
  def change
  	create_table :examination_schedule_users, id: :integer do |t|
  		t.integer :examination_schedule_id
  		t.integer :user_id
  		t.integer :doctor_id
  		t.integer :hospital_id
  		t.string :dayname
  		t.timestamps null: false
  	end
  end
end
