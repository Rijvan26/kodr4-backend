interface GoalCardProps {
  creatorName: string;
  totalAmount?: number;
  totalSupporters?: number;
  coffeePrice?: number;
}

export const GoalCard = ({
  creatorName,
  totalAmount = 0,
  totalSupporters = 0,
  coffeePrice = 100,
}: GoalCardProps) => {
  // Dynamic milestone target based on current raised amount
  const targetAmount = totalAmount > 0
    ? Math.max(coffeePrice * 10, Math.ceil((totalAmount + 1) / (coffeePrice * 10)) * (coffeePrice * 10))
    : coffeePrice * 10;

  const percentage = Math.min(100, Math.round((totalAmount / targetAmount) * 100));
  const remaining = Math.max(0, targetAmount - totalAmount);

  return (
    <div className="bg-surface-container-lowest rounded-[20px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,61,46,0.05)] border border-outline-variant/30 relative overflow-hidden">
      {/* Soft ambient glow behind goal */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-tertiary-fixed opacity-40 blur-xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4 relative z-10 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#D4E6C3] text-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded-full mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>Community Milestone</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-primary">
            Support Goal for {creatorName}
          </h3>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="font-headline-sm text-headline-sm text-[#0F3D2E]">
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            of ₹{targetAmount.toLocaleString("en-IN")} target
          </span>
        </div>
      </div>

      {/* Progress Bar with gradient */}
      <div className="mt-4 relative z-10">
        <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#10B981] to-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 font-label-sm text-label-sm text-on-surface-variant">
          <span>
            {percentage}% completed • {totalSupporters} {totalSupporters === 1 ? "backer" : "backers"}
          </span>
          <span>₹{remaining.toLocaleString("en-IN")} remaining</span>
        </div>
      </div>

      <p className="font-body-md text-body-md text-on-surface-variant mt-4 leading-relaxed relative z-10">
        {totalAmount > 0
          ? `${totalSupporters} ${totalSupporters === 1 ? "supporter has" : "supporters have"} contributed ₹${totalAmount.toLocaleString("en-IN")} so far to fuel ${creatorName}'s creative journey.`
          : `Be the very first supporter to buy ${creatorName} a coffee and help launch their creator milestone!`}
      </p>
    </div>
  );
};

export default GoalCard;
