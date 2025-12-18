using MonetaryControl_BD.Models;

namespace MonetaryControl_BD.DTO
{
    public class SavingDto
    {

        public int SavingsId { get; set; }

        public decimal Amount { get; set; }

        public DateTime SavingsDate { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }


        public int UserId { get; set; }
        public string UserName { get; set; } = null!;


    }

    public class CreateSavingDto
    {
        public int UserId { get; set; }
        public string Description { get; set; } = null!;
        public string Amount { get; set; } = null!;

    }

}
