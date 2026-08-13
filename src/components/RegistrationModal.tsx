import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Swords, Mail, User, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    teamName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Welcome to the Clan Wars, warrior!", {
      icon: "⚔️",
      description: "Check your email for battle instructions.",
      style: {
        background: "hsl(120 100% 41%)",
        color: "hsl(0 0% 10%)",
        border: "none",
      },
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-elixir/90"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md"
          >
            {/* Stone frame */}
            <div className="card-stone overflow-hidden">
              {/* Wood header */}
              <div className="panel-wood -mx-6 -mt-6 mb-6 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Swords className="text-gold-coin" size={24} />
                  <h2 className="font-display text-xl text-foreground">Join the Battle</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-dark-elixir/50 flex items-center justify-center"
                >
                  <X size={18} className="text-foreground" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name field */}
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 block">
                    Warrior Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-dark-elixir/50 border-2 border-border focus:border-gold-coin font-body text-foreground placeholder:text-muted-foreground outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 block">
                    Battle Orders Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-dark-elixir/50 border-2 border-border focus:border-gold-coin font-body text-foreground placeholder:text-muted-foreground outline-none transition-colors"
                      placeholder="warrior@clan.com"
                    />
                  </div>
                </div>

                {/* Team name field */}
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 block">
                    Clan Name (Optional)
                  </label>
                  <div className="relative">
                    <Users
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={formData.teamName}
                      onChange={(e) =>
                        setFormData({ ...formData, teamName: e.target.value })
                      }
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-dark-elixir/50 border-2 border-border focus:border-gold-coin font-body text-foreground placeholder:text-muted-foreground outline-none transition-colors"
                      placeholder="Your team name"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-3d-green w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={24} />
                    </motion.div>
                  ) : (
                    <>
                      <Swords className="mr-2" size={20} />
                      Deploy to Battle
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer text */}
              <p className="mt-6 text-center font-body text-xs text-muted-foreground">
                By joining, you agree to the{" "}
                <a href="#" className="text-gold-coin hover:underline">
                  Code of Conduct
                </a>{" "}
                and{" "}
                <a href="#" className="text-gold-coin hover:underline">
                  Terms of Service
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;
