class AddNoOrderToExaminationScheduleUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :examination_schedule_users, :no_order, :integer
  end
end
