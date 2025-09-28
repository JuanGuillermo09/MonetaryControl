using Microsoft.AspNetCore.Mvc;
using MonetaryControl_BD.DTO;
using MonetaryControl_BD.Service;

[ApiController]
[Route("api/[controller]")]
public class ExpenseController : ControllerBase
{
    private readonly IExpenseService _service;

    public ExpenseController(IExpenseService service)
    {
        _service = service;
    }

    // ✅ GET: api/Expense
    [HttpGet("ListExpenses")]
    public async Task<IActionResult> GetAll()
    {
        var expenses = await _service.GetAllAsync();
        return Ok(expenses);
    }

    // ✅ GET: api/Expense/5
    [HttpGet("ListExpenses/{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var expense = await _service.GetByIdAsync(id);
        return expense is null ? NotFound(new { message = "Expense not found" }) : Ok(expense);
    }

    // ✅ POST: api/Expense
    [HttpPost("CreateExpenses")]
    public async Task<IActionResult> Create([FromForm] CreateExpenseDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.ExpenseId }, created);
    }

    // ✅ PUT: api/Expense/5
    [HttpPut("UpdateExpenses/{id:int}")]
    public async Task<IActionResult> Update(int id, [FromForm] UpdateExpenseDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated is null ? NotFound(new { message = "Expense not found" }) : Ok(updated);
    }

    // ✅ DELETE: api/Expense/5
    [HttpDelete("DeleteExpenses/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound(new { message = "Expense not found" });
    }
}
