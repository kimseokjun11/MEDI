package controller;

import model.Drug;
import service.DrugService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drug")
@CrossOrigin(origins = "*")
public class DrugController {

    private final DrugService drugService;

    public DrugController(DrugService drugService) {
        this.drugService = drugService;
    }

    @GetMapping
    public List<Drug> getDrug(@RequestParam String itemName) {
        return drugService.fetchDrug(itemName);
    }
}