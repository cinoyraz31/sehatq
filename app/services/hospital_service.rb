class HospitalService
    def initialize(controller = false)
        @controller = controller
    end
    
    def before_save_polis(params = {})
        polies = params[:poly]
        data_saves = []
        flags = []

        if polies.present? && polies.count > 0
            polies.each do|poly|
                poly = Poly.new(poly.as_json)

                flags << poly.valid?
                data_saves << poly
            end
        end
        return {
            flags: flags,
            data_saves: data_saves,
        }
    end
end